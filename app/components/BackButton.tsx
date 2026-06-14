'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();
    function handleClick() {
        router.push('/');
        router.refresh();
    }
    
	return <button
			type="button"
            onClick={handleClick}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700"
            >
            Back
            </button>
}