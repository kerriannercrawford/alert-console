import {useAlerts} from "./hooks/useAlerts.ts";

export default function App() {
    const alerts = useAlerts()
    console.log(alerts)

    return (
        <div className="App">
            <h1>Welcome to the UI!</h1>
            <p>This is a placeholder.</p>
        </div>
    )
}