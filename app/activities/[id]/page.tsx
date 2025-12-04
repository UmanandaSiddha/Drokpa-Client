import { activities } from "../../../data/activities";
import { notFound } from "next/navigation";
import TextPressure from "@/components/ui/textPressure";
import DecryptedText from "@/components/ui/decryptedText";

export default async function ActivityDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = activities.find((a) => a.id === Number(id));

  if (!activity) return notFound();

  return (
    <div className="max-w-full mx-auto">
      <img
        src={activity.image}
        alt={activity.title}
        className="w-full h-80 object-cover mb-6"
      />

      {/* <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
      <p className="text-lg text-gray-700 mb-4">{activity.shortInfo}</p>
      <p className="text-gray-600">{activity.details}</p> */}

      <div style={{ position: "relative", height: "300px" }}>
        <TextPressure
          text="Coming Soon!"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#005246"
          strokeColor="#ff0000"
          minFontSize={36}
        />
      </div>

      {/* <DecryptedText text="COMING SOON!"/> */}

      {/* <div className="text-5xl">
        <DecryptedText
          text="COMING SOON!"
          animateOn="view"
          revealDirection="center"
          maxIterations={20}
          speed={100}
        />
      </div> */}
    </div>
  );
}
