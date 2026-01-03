import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface Automation {
  id: string;
  name: string;
  trigger: {
    type: 'spend_limit' | 'roas_drop' | 'conversions_low' | 'time_based';
    conditions: any;
  };
  actions: Array<{
    type: 'pause_campaign' | 'send_email' | 'send_slack' | 'adjust_budget';
    parameters: any;
  }>;
  enabled: boolean;
  lastRun?: string;
}

interface AutomationResult {
  automationId: string;
  triggered: boolean;
  executed: boolean;
  message: string;
  timestamp: string;
}

class AutomationEngine {
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;

  async start() {
    if (this.isRunning) {
      console.log('Automation engine already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting automation engine...');

    // Check automations every 5 minutes
    this.interval = setInterval(async () => {
      await this.checkAndExecuteAutomations();
    }, 5 * 60 * 1000); // 5 minutes

    // Run immediately on start
    await this.checkAndExecuteAutomations();
  }

  async stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('Automation engine stopped');
  }

  private async checkAndExecuteAutomations() {
    try {
      console.log('Checking automations...');
      
      // Fetch all enabled automations
      const { data: automations, error } = await supabaseAdmin
        .from('automations')
        .select('*')
        .eq('enabled', true);

      if (error) {
        console.error('Failed to fetch automations:', error);
        return;
      }

      const results: AutomationResult[] = [];

      for (const automation of automations) {
        try {
          const result = await this.executeAutomation(automation);
          results.push(result);
          
          // Log execution
          await this.logExecution(result);
        } catch (error) {
          console.error(`Failed to execute automation ${automation.id}:`, error);
          results.push({
            automationId: automation.id,
            triggered: false,
            executed: false,
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            timestamp: new Date().toISOString()
          });
        }
      }

      console.log(`Processed ${automations.length} automations, ${results.filter(r => r.executed).length} executed`);
    } catch (error) {
      console.error('Error in automation check:', error);
    }
  }

  private async executeAutomation(automation: Automation): Promise<AutomationResult> {
    const { trigger, actions, id } = automation;
    
    // Check if trigger conditions are met
    const shouldTrigger = await this.evaluateTrigger(trigger);
    
    if (!shouldTrigger) {
      return {
        automationId: id,
        triggered: false,
        executed: false,
        message: 'Trigger conditions not met',
        timestamp: new Date().toISOString()
      };
    }

    // Execute actions
    const executionResults = [];
    for (const action of actions) {
      try {
        const result = await this.executeAction(action);
        executionResults.push(result);
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
        executionResults.push(false);
      }
    }

    // Update last run time
    await supabaseAdmin
      .from('automations')
      .update({ lastRun: new Date().toISOString() })
      .eq('id', id);

    return {
      automationId: id,
      triggered: true,
      executed: executionResults.every(r => r),
      message: `Executed ${executionResults.filter(r => r).length}/${executionResults.length} actions`,
      timestamp: new Date().toISOString()
    };
  }

  private async evaluateTrigger(trigger: any): Promise<boolean> {
    const { type, conditions } = trigger;

    switch (type) {
      case 'spend_limit':
        return await this.checkSpendLimit(conditions);
      case 'roas_drop':
        return await this.checkROASDrop(conditions);
      case 'conversions_low':
        return await this.checkConversionsLow(conditions);
      case 'time_based':
        return this.checkTimeBased(conditions);
      default:
        return false;
    }
  }

  private async checkSpendLimit(conditions: any): Promise<boolean> {
    const { campaignId, limit, period } = conditions;
    
    // Fetch campaign spend for the period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const { data: campaigns } = await supabaseAdmin
      .from('campaigns')
      .select('spend')
      .eq('id', campaignId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString());

    const totalSpend = campaigns?.reduce((sum, c) => sum + (c.spend || 0), 0) || 0;
    
    return totalSpend >= limit;
  }

  private async checkROASDrop(conditions: any): Promise<boolean> {
    const { campaignId, threshold, period } = conditions;
    
    // Fetch campaign ROAS for the period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const { data: campaigns } = await supabaseAdmin
      .from('campaigns')
      .select('spend, revenue')
      .eq('id', campaignId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString());

    const totalSpend = campaigns?.reduce((sum, c) => sum + (c.spend || 0), 0) || 0;
    const totalRevenue = campaigns?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    
    return roas < threshold;
  }

  private async checkConversionsLow(conditions: any): Promise<boolean> {
    const { campaignId, threshold, period } = conditions;
    
    // Fetch campaign conversions for the period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const { data: campaigns } = await supabaseAdmin
      .from('campaigns')
      .select('conversions')
      .eq('id', campaignId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString());

    const totalConversions = campaigns?.reduce((sum, c) => sum + (c.conversions || 0), 0) || 0;
    
    return totalConversions < threshold;
  }

  private checkTimeBased(conditions: any): boolean {
    const { schedule } = conditions;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return schedule.some((timeRange: any) => {
      const [start, end] = timeRange.split('-').map((t: string) => {
        const [hours, minutes] = t.split(':').map(Number);
        return hours * 60 + minutes;
      });
      
      if (start <= end) {
        return currentTime >= start && currentTime <= end;
      } else {
        // Overnight range (e.g., 22:00-06:00)
        return currentTime >= start || currentTime <= end;
      }
    });
  }

  private async executeAction(action: any): Promise<boolean> {
    const { type, parameters } = action;

    switch (type) {
      case 'pause_campaign':
        return await this.pauseCampaign(parameters.campaignId);
      case 'send_email':
        return await this.sendEmail(parameters);
      case 'send_slack':
        return await this.sendSlack(parameters);
      case 'adjust_budget':
        return await this.adjustBudget(parameters);
      default:
        console.warn(`Unknown action type: ${type}`);
        return false;
    }
  }

  private async pauseCampaign(campaignId: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('campaigns')
        .update({ status: 'paused' })
        .eq('id', campaignId);

      if (error) throw error;
      
      console.log(`Campaign ${campaignId} paused by automation`);
      return true;
    } catch (error) {
      console.error(`Failed to pause campaign ${campaignId}:`, error);
      return false;
    }
  }

  private async sendEmail(parameters: any): Promise<boolean> {
    try {
      // In production, integrate with email service (SendGrid, Resend, etc.)
      console.log('Email action executed:', parameters);
      
      // Log email sent
      await supabaseAdmin
        .from('automation_logs')
        .insert({
          action: 'send_email',
          parameters,
          status: 'sent',
          timestamp: new Date().toISOString()
        });
      
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private async sendSlack(parameters: any): Promise<boolean> {
    try {
      // In production, integrate with Slack API
      console.log('Slack action executed:', parameters);
      
      // Log Slack message sent
      await supabaseAdmin
        .from('automation_logs')
        .insert({
          action: 'send_slack',
          parameters,
          status: 'sent',
          timestamp: new Date().toISOString()
        });
      
      return true;
    } catch (error) {
      console.error('Failed to send Slack message:', error);
      return false;
    }
  }

  private async adjustBudget(parameters: any): Promise<boolean> {
    try {
      const { campaignId, newBudget, adjustmentType } = parameters;
      
      const { error } = await supabaseAdmin
        .from('campaigns')
        .update({ 
          budget: adjustmentType === 'increase' 
            ? `+${newBudget}` 
            : `-${newBudget}` 
        })
        .eq('id', campaignId);

      if (error) throw error;
      
      console.log(`Campaign ${campaignId} budget adjusted by automation`);
      return true;
    } catch (error) {
      console.error('Failed to adjust budget:', error);
      return false;
    }
  }

  private async logExecution(result: AutomationResult) {
    try {
      await supabaseAdmin
        .from('automation_executions')
        .insert({
          automation_id: result.automationId,
          triggered: result.triggered,
          executed: result.executed,
          message: result.message,
          timestamp: result.timestamp
        });
    } catch (error) {
      console.error('Failed to log automation execution:', error);
    }
  }
}

// Singleton instance
export const automationEngine = new AutomationEngine();
