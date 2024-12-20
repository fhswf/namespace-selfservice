import "./globals.css";

export const metadata = {
	title: "deployKF SelfService",
};

export default function RootLayout({ children }) {
	return (
		<html lang="de" className="h-full">
			<body className="h-full">{children}</body>
		</html>
	);
}
