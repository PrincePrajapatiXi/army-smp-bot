import Loader from "@/components/Loader";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <Loader />
        </div>
    );
}
