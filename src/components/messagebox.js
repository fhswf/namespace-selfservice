export default function MessageBox({ message, isError }) {
	const colorClass = isError
		? "bg-red-100 border-red-400 text-red-700"
		: "bg-green-100 border-green-400 text-green-700";

	if (!message) return null;

	return (
		<div
			className={`mb-6 max-w-md text-center border px-4 py-3 rounded ${colorClass}`}
		>
			{message}
		</div>
	);
}
