import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { TrendItem } from '@/types';

interface AreaChartProps {
  data: TrendItem[];
  title?: string;
  color?: string;
  height?: number;
}

export function AreaChart({ data, title, color = '#00F0FF', height = 300 }: AreaChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      grid: {
        top: 40,
        left: 50,
        right: 20,
        bottom: 30,
      },
      title: title
        ? {
            text: title,
            textStyle: {
              color: '#94a3b8',
              fontSize: 14,
              fontWeight: 'normal',
            },
            left: 0,
            top: 0,
          }
        : undefined,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(d => d.time),
        axisLine: {
          lineStyle: {
            color: '#334155',
          },
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#1e293b',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
        },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          showSymbol: false,
          data: data.map(d => d.count),
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color },
              { offset: 1, color: '#3b82f6' },
            ]),
            shadowColor: color,
            shadowBlur: 10,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}40` },
              { offset: 1, color: `${color}00` },
            ]),
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color,
              borderColor: '#fff',
              borderWidth: 2,
            },
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        textStyle: {
          color: '#e2e8f0',
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: `${color}60`,
            width: 1,
          },
        },
      },
      animationDuration: 1000,
      animationEasing: 'cubicOut',
    };

    chartInstance.current.setOption(option, true);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [data, title, color]);

  return <div ref={chartRef} style={{ height }} />;
}
