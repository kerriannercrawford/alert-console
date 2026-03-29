import { AlertsTableProps } from '../types.ts'


export function AlertsTable({ alerts, loading, latestEventByAlertId, onRowClick, onRefresh, onCreateAlert }: AlertsTableProps) {
    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Severity</th>
                        <th>Channel</th>
                        <th>Status</th>
                        <th>Latest Delivery State</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map(alert => (
                        <tr key={alert.id} onClick={() => onRowClick(alert.id)} style={{ cursor: 'pointer' }}>
                            <td>{alert.title}</td>
                            <td><span className={`badge badge-${alert.severity}`}>{alert.severity}</span></td>
                            <td>{alert.channel}</td>
                            <td><span className={`badge badge-${alert.status}`}>{alert.status}</span></td>
                            <td>
                                {latestEventByAlertId[alert.id]
                                    ? <span className={`badge badge-event-${latestEventByAlertId[alert.id].event_type}`}>{latestEventByAlertId[alert.id].event_type}</span>
                                    : <span className="badge-empty">—</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="table-footer">
                <button className="refresh-btn" onClick={onRefresh} disabled={loading}>
                    {loading ? 'Refreshing…' : 'Refresh'}
                </button>
                <button className="create-btn" onClick={onCreateAlert}>
                    Create Alert
                </button>
            </div>
        </div>
    )
}