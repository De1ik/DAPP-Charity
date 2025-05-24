import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const FundraiserSummaryStats = ({ stats }) => {
    const COLORS = {
        canceled: '#FF9100', // Orange for canceled
        finished: '#34d399', // Teal from screenshot for finished
        active: '#87ceeb'   // Light blue for active
    };

    const data = [
        { name: 'Canceled', value: stats.canceled, color: COLORS.canceled },
        { name: 'Finished', value: stats.finished, color: COLORS.finished },
        { name: 'Active', value: stats.active, color: COLORS.active }
    ];

    const total = stats.canceled + stats.finished + stats.active;
    const percentUsedCorrectly = Math.round((stats.finished / total) * 100) || 0;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#2a2a2a] p-2 rounded-lg border border-[#34d399] text-white text-sm">
                    <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-container">
            <div className="chart-title">Donation Trends</div>
            <p className="wallet-address text-center text-sm text-[#e0e0e0] mb-4">Wallet: {stats.wallet}</p>

            <div className="flex justify-center">
                <PieChart width={400} height={300}>
                    <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </div>

            <div className="labels mt-6 space-y-2">
                <div className="label-item flex items-center">
                    <span className="dot mr-2" style={{ backgroundColor: COLORS.canceled }}></span>
                    <span className="text-sm text-[#ccc]">Canceled <small className="text-xs text-gray-500">(* Jar was not approved by DAO)</small></span>
                </div>
                <div className="label-item flex items-center">
                    <span className="dot mr-2" style={{ backgroundColor: COLORS.finished }}></span>
                    <span className="text-sm text-[#ccc]">Finished <small className="text-xs text-gray-500">(* Jar was successfully approved by DAO)</small></span>
                </div>
                <div className="label-item flex items-center">
                    <span className="dot mr-2" style={{ backgroundColor: COLORS.active }}></span>
                    <span className="text-sm text-[#ccc]">Active <small className="text-xs text-gray-500">(* opened and existing jar)</small></span>
                </div>
            </div>

            <p className="success-rate text-center mt-6 text-[#e0e0e0]">
                <strong className="text-[#34d399] text-lg">{percentUsedCorrectly}%</strong> of funds collected from the jars of this user were sent correctly
            </p>
        </div>
    );
};

export default FundraiserSummaryStats;