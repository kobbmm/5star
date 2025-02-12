import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  const titles = {
    "Total Reviews": "จำนวนการประเมิน",
    "Average Rating": "คะแนนเฉลี่ย",
    "5-Star Reviews": "ความพึงพอใจสูงสุด"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-title">{titles[title] || title}</h3>
        <p className="stat-value">{value}</p>
        {trend && (
          <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
};
