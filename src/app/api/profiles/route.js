import { NextResponse } from "next/server";
import { headers } from "next/headers";
import yaml from "yaml";

import {
	isValidNamespace,
	getFileContentFromGitHub,
	updateFileContentOnGitHub,
	namespaceExists,
	userExists,
	createUser,
} from "@/libs/utils";

export async function GET() {
	try {
		const HEADER_LIST = await headers();
		const USER_MAIL = HEADER_LIST.get("kubeflow-userid");

		if (!USER_MAIL) {
			return NextResponse.json(
				{ message: "Benutzer nicht authentifiziert" },
				{ status: 401 }
			);
		}

		const { content } = await getFileContentFromGitHub();
		const DATA = yaml.parse(content);

		return NextResponse.json({ isRegistered: userExists(DATA, USER_MAIL) });
	} catch (error) {
		console.error("Error getting profile:", error.message);
		return NextResponse.json(
			{ message: "Profil prüfung fehlgeschlagen" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const HEADER_LIST = await headers();
		const USER_MAIL = HEADER_LIST.get("kubeflow-userid");

		if (!USER_MAIL) {
			return NextResponse.json(
				{ message: "Benutzer nicht authentifiziert" },
				{ status: 401 }
			);
		}

		const { namespace } = await request.json();
		if (!namespace) {
			return NextResponse.json(
				{ message: "Namespace fehlt" },
				{ status: 400 }
			);
		}

		if (!isValidNamespace(namespace)) {
			return NextResponse.json(
				{
					message:
						"Der Name darf nur Kleinbuchstaben, Zahlen und Bindestriche enhalten \
						und muss mit einem Buchstaben oder einer Zahl beginnen und enden",
				},
				{ status: 400 }
			);
		}

		const FULL_NAMESPACE = `kf-${namespace}`;
		const { content, sha } = await getFileContentFromGitHub();
		const DATA = yaml.parse(content);

		if (userExists(DATA, USER_MAIL)) {
			return NextResponse.json(
				{ message: "Benutzer existiert bereits" },
				{ status: 400 }
			);
		}

		if (namespaceExists(DATA, FULL_NAMESPACE)) {
			return NextResponse.json(
				{ message: "Namespace existiert bereits" },
				{ status: 400 }
			);
		}

		const UPDATED_DATA = yaml.stringify(
			createUser(DATA, USER_MAIL, FULL_NAMESPACE)
		);

		const GH_RESULT = await updateFileContentOnGitHub(UPDATED_DATA, sha);

		if (GH_RESULT?.status !== 200) {
			throw new Error("Updating file content on GitHub failed");
		}

		return NextResponse.json({ message: "Profil erfolgreich erstellt" });
	} catch (error) {
		console.error("Error creating profile:", error.message);
		return NextResponse.json(
			{ message: "Profil erstellen fehlgeschlagen" },
			{ status: 500 }
		);
	}
}
