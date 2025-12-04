import { activities } from "../../../data/activities";
import { notFound } from "next/navigation";

export default async function ActivityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = activities.find((a) => a.id === Number(id));

  if (!activity) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <img
        src={activity.image}
        alt={activity.title}
        className="w-full h-80 object-cover rounded-xl mb-6"
      />

      <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
      <p className="text-lg text-gray-700 mb-4">{activity.shortInfo}</p>
      <p className="text-gray-600">{activity.details}</p>
    </div>
  );
}
