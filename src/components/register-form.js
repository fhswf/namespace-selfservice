export default function RegisterForm({ onMsg }) {
	async function register(event) {
		event.preventDefault();

		const namespace = event.target.namespace.value;
		if (!namespace) {
			onMsg("Namespace darf nicht leer sein", true);
			return;
		}

		try {
			const response = await fetch(
				`${process.env.basePath}/api/profiles`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ namespace }),
				}
			);
			const data = await response.json();
			onMsg(data.message, !response.ok);
		} catch (err) {
			onMsg(err.message, true);
		}
	}

	return (
		<form onSubmit={register}>
			<label
				htmlFor="namespace"
				className="block text-gray-800 font-medium mb-2"
			>
				Name
			</label>
			<input
				id="namespace"
				type="text"
				required
				className="w-full rounded-md bg-gray-50 p-2 text-gray-800 outline outline-gray-300 outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
				placeholder="my-namespace"
			/>
			<button
				type="submit"
				className="mt-6 bg-blue-500 w-full text-white px-4 py-2 font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
			>
				Registrieren
			</button>
		</form>
	);
}
