"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2.5, className = "" }: AnimatedCounterProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp start={0} end={end} duration={duration} prefix={prefix} suffix={suffix} separator="," />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
}
