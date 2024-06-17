import RingLoader from "react-spinners/RingLoader";
import "./Loader.sass";

export default function Loader() {
    return (
        <div className="sheet loader">
            <RingLoader color="#967bb6 " />
        </div>
    );
}
