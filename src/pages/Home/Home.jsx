import { Navigate } from 'react-router-dom';
import styles from './Home.module.css';

void styles;

export default function Home() {
	return <Navigate to="/biblioteca" replace />;
}
