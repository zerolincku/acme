import { useNavigation } from 'react-router-dom';
export default function GlobalLoading() {
    const navigation = useNavigation();
    const isLoading = navigation.state !== 'idle';

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div className="h-1 bg-blue-600 animate-pulse" />
        </div>
    );
}
