import { VideoTile } from "@/components/motion/VideoTile";

const SPAN_PATTERN = [
  "row-span-2",
  "row-span-1",
  "col-span-2 row-span-1",
  "row-span-1",
  "row-span-2",
  "row-span-1",
];

export function VideoGrid({
  items,
}: {
  items: { src: string; caption: string }[];
}) {
  return (
    <div className="grid grid-cols-2 auto-rows-[140px] grid-flow-dense gap-3 md:grid-cols-4 md:auto-rows-[160px]">
      {items.map((item, i) => (
        <VideoTile
          key={item.src + i}
          src={item.src}
          caption={item.caption}
          className={SPAN_PATTERN[i % SPAN_PATTERN.length]}
        />
      ))}
    </div>
  );
}
