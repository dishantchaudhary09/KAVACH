import cron from "node-cron";
import { runAutomaticRiskMonitoring } from "./autoRiskService.js";

export const startRiskScheduler = () => {
  console.log("⏰ Risk monitoring scheduler started");

  const intervalMinutes = Math.min(
    59,
    Math.max(1, Number(process.env.RISK_MONITORING_INTERVAL_MINUTES) || 30),
  );
  const cronExpression = `*/${intervalMinutes} * * * *`;
  let monitoringInProgress = false;

  const runMonitoring = async (label) => {
    if (monitoringInProgress) {
      console.log("⏭️ Risk monitoring already running; skipping overlap");
      return;
    }

    monitoringInProgress = true;
    console.log(label);

    try {
      await runAutomaticRiskMonitoring();
    } catch (error) {
      console.error("Automatic monitoring error:", error.message);
    } finally {
      monitoringInProgress = false;
    }
  };

  runMonitoring("🔄 Running initial risk monitoring...");

  cron.schedule(cronExpression, async () => {
    await runMonitoring("🔄 Running scheduled risk monitoring...");
  });

  console.log(`📡 Monitoring interval: every ${intervalMinutes} minute(s)`);
};
