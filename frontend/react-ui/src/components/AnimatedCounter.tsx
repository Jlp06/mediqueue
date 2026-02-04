import { useEffect, useState } from "react";

interface Props {
    end: number;
    duration?: number;
}

export default function AnimatedCounter({ end, duration = 1500 }: Props) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 20);

        const timer = setInterval(() => {
            start += increment;

            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 20);

        return () => clearInterval(timer);
    }, [end, duration]);

    return <>{count}</>;
}
