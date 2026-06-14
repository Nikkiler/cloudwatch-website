'use client';

type SaveButtonProps = {
  onSave: () => void;
}

export default function SaveButton({ onSave }: SaveButtonProps) {
	return (
    <button
      type="button"
      onClick={onSave}
      className="px-4 py-2 text-xs font-medium rounded-lg bg-ok text-black hover:brightness-110"
    >
      Save
    </button>
  );
}