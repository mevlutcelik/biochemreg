"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { post } from "@/lib/api";

export default function Register() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const router = useRouter();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const response = await post({
				endpoint: 'auth/register',
				body: {name, email, password}
			});
			if(response.status){
				setMessage('Registration successful');

				const expirationDate = new Date();
				expirationDate.setFullYear(expirationDate.getFullYear() + 10);

				document.cookie = `token=${response.token}; path=/; expires=${expirationDate.toUTCString()};`;

				router.push('/dashboard');
			}else{
				setMessage('Registration failed: ' + response.message);
			}
		} catch (error) {
			setMessage('Registration failed: ' + (error.message || 'Unknown error'));
		}
	};

	return (
		<div>
			<h1>Register</h1>
			<form onSubmit={handleRegister}>
				<div>
					<label>Name:</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Register</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}