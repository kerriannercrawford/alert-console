import {Audience, Channel, CreateAlertSlideoutProps, Severity, Status} from "../types.ts";
import {useCreateAlert} from "../hooks/useCreateAlert.ts";
import {FormEvent, useState} from "react";

const severityOptions: Severity[] = ["low", "medium", "high", "critical"]
const audienceOptions: Audience[] = ["responders", "admins", "all"]
const channelOptions: Channel[] = ["sms", "email", "push", "chat"]
const statusOptions: Status[] = ["draft", "active", "resolved"]

export function CreateAlertSlideout({ isOpen, onClose }: CreateAlertSlideoutProps) {
    const { create, error, loading } = useCreateAlert()

    const [title, setTitle] = useState("")
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState<Severity>("low")
    const [audience, setAudience] = useState<Audience>("all")
    const [channel, setChannel] = useState<Channel>("sms")
    const [status, setStatus] = useState<Status>("draft")

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        const created = await create({
            title,
            message,
            severity,
            audience,
            channel,
            status,
        })

        if (created) {
            setTitle("")
            setMessage("")
            setSeverity("low")
            setAudience("all")
            setChannel("sms")
            setStatus("draft")
            onClose()
        }
    }

    return (
        <>
            <div className={`drawer-backdrop${isOpen ? " is-open" : ""}`} onClick={onClose} />
            <aside className={`drawer${isOpen ? " is-open" : ""}`}>
                <div className="drawer-header">
                    <h2>Create Alert</h2>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className="drawer-body">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor={"title"}>Title</label>
                            <input id={"title"} type={"text"} value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor={"message"}>Message</label>
                            <textarea id={"message"} value={message} onChange={(e) => setMessage(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor={"severity"}>Severity</label>
                            <select id={"severity"} value={severity} onChange={(e) => setSeverity(e.target.value as Severity)}>
                                {severityOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor={"audience"}>Audience</label>
                            <select id={"audience"} value={audience} onChange={(e) => setAudience(e.target.value as Audience)}>
                                {audienceOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor={"channel"}>Channel</label>
                            <select id={"channel"} value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                                {channelOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor={"status"}>Status</label>
                            <select id={"status"} value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        {error && <p className="error">{error}</p>}

                        <div>
                            <button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Alert"}
                            </button>
                        </div>
                    </form>
                </div>
            </aside>
        </>
    )
}
