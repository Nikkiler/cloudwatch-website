'use client'
export default function BackButton() {
	return <button
			type="button"
            onClick={clickHandle}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700"
            >
            Back
            </button>
}
function clickHandle() {
	window.history.back();
}