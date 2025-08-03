'use client';

import { useForm } from 'react-hook-form';

type TravelFormInputs = {
  departure: string;
  destination: string;
  startDate: string;
  days: number;
  people: string;
  hasCar: boolean;
  useHighway: boolean;
  budget: number;
  hotelReserved: boolean;
  hotelName: string;
  preferences: string[];
  considerations: string;
  relaxingTrip: boolean;
};

export default function TravelForm() {
  const { register, handleSubmit, watch } = useForm<TravelFormInputs>();
  const hotelReserved = watch('hotelReserved');

  const onSubmit = async (data: TravelFormInputs) => {
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    alert('プラン生成完了！🎉\n' + JSON.stringify(result, null, 2));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold mb-4">旅行プラン作成フォーム🌈</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('departure')} placeholder="出発地（例：東京駅）" className="input" />
        <input {...register('destination')} placeholder="目的地（例：長野県白馬村）" className="input" />
        <input type="date" {...register('startDate')} className="input" />
        <input type="number" {...register('days')} placeholder="日数（例：2）" className="input" />
        <input {...register('people')} placeholder="人数（例：大人2人 子供1人）" className="input" />

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('hasCar')} />
          車を使う
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('useHighway')} />
          高速道路を使う
        </label>

        <input type="number" {...register('budget')} placeholder="予算（1人あたり）" className="input" />

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('hotelReserved')} />
          ホテルは予約済み
        </label>
        {hotelReserved && (
          <input {...register('hotelName')} placeholder="ホテル名" className="input" />
        )}

        <fieldset className="space-y-2">
          <legend className="font-semibold">旅行で求めるもの（複数選択可）</legend>
          {['自然', '商業施設', 'グルメ', '癒し', 'アクティビティ'].map((tag) => (
            <label key={tag} className="flex items-center gap-2">
              <input type="checkbox" value={tag} {...register('preferences')} />
              {tag}
            </label>
          ))}
        </fieldset>

        <input {...register('considerations')} placeholder="配慮事項（例：子供あり）" className="input" />

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('relaxingTrip')} />
          ゆったり回りたい
        </label>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          プラン作成！📄✨
        </button>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}