import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { BoothRankingItem } from '@/types';

interface BarChartProps {
  data: BoothRankingItem[];
  title?: string;
  height?: number;
}

export function BarChart({ data, title, height = 400 }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const colors = ['#00F0FF', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      grid: {
        top: 50,
        left: 100,
        right: 40,
        bottom: 20,
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
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: [...data].reverse().map(d => d.boothName),
        inverse: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#e2e8f0',
          fontSize: 12,
          fontWeight: 500,
        },
      },
      series: [
        {
          type: 'bar',
          data: [...data].reverse().map((d, index) => ({
            value: d.count,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: `${colors[index % colors.length]}20` },
                { offset: 1, color: colors[index % colors.length] },
              ]),
              borderRadius: [0, 4, 4, 0],
              shadowColor: `${colors[index % colors.length]}30`,
              shadowBlur: 10,
            },
          })),
          barWidth: 16,
          showBackground: true,
          backgroundStyle: {
            color: '#1e293b',
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: 'right',
            color: '#e2e8f0',
            fontSize: 12,
            fontWeight: 600,
            formatter: '{c}',
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 20,
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
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 240, 255, 0.05)',
          },
        },
      },
      animationDuration: 1500,
      animationEasing: 'elasticOut',
      animationDelay: (_idx: number) => _idx * 100,
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
  }, [data, title]);

  return <div ref={chartRef} style={{ height }} />;
}
