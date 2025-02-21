export default function Error({ error }: { error?: string }) {
    if (!error || !error.length) return null;
    return (
        <p className="text-red-500 mt-2">
            {error}
        </p>
    );
}
