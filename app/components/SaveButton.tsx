'use client'
import saveHandler from '../lib/saveHandler';

export default function SaveButton() {
	return <button
              type="button"
              onClick={saveHandler}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-ok text-black hover:brightness-110"
            >
              Save
            </button>;
}