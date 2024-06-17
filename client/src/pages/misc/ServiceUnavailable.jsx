import { ServiceUnavailableSVG } from "../../assets";

export default function ServiceUnavailable() {
    return (
        <div className="sheet" style={{ display: "flex", justifyContent: "center" }}>
            <ServiceUnavailableSVG style={{ height: "100vh" }} />
        </div>
    );
}
