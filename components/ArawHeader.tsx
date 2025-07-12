import Image from 'next/image';
import Link from 'next/link';

export default function ArawHeader() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link href="/">
        <Image
          src="/araw-logo.jpg"
          alt="Araw General Trading"
          width={150}
          height={150}
          className="rounded"
        />
      </Link>
      <h1 className="text-xl font-bold">Araw General Trading</h1>
    </div>
  );
}
