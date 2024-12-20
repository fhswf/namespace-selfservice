"use client";

import { useState, useEffect } from "react";
import MessageBox from "@/components/messagebox";
import Loading from "@/app/loading";
import RegisterForm from "@/components/register-form";

export default function Home() {
	const [message, setMessage] = useState({
		message: "",
		isError: false,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isRegistered, setIsRegistered] = useState(false);

	function updateMessage(message, isError = false) {
		setMessage({ message, isError });
	}

	useEffect(() => {
		const checkIfRegistered = async () => {
			const response = await fetch(
				`${process.env.basePath}/api/profiles`
			);
			const data = await response.json();
			setIsRegistered(data?.isRegistered);
			setIsLoading(false);
		};

		checkIfRegistered();
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<main className="min-h-full bg-gray-100 flex flex-col justify-center items-center">
			<MessageBox message={message.message} isError={message.isError} />
			<h1 className="text-3xl font-bold text-blue-600 mb-6">
				Namespace Registrierung
			</h1>
			<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
				{isRegistered ? (
					<p className="font-semibold text-center text-red-600">
						Es wurde bereits ein Namespace registriert.
					</p>
				) : (
					<RegisterForm onMsg={updateMessage} />
				)}
			</div>
			<p className="mt-4 text-gray-500">
				Der Name kann nach der Erstellung nicht mehr geändert werden!
			</p>
			<p className="mt-2 text-gray-500">
				Es kann bis zu 15 Minuten dauern, bis der Namespace erstellt
				wurde.
			</p>
		</main>
	);
}
