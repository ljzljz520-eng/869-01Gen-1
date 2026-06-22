import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { IndustryDistributionItem } from '@/types';

interface PieChartProps {
  data: IndustryDistributionItem[];
  title?: string;
  height?: number;
}

export function PieChart({ data, title, height = 350 }: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const colors = ['#00F0FF', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#10b981'];

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: title
        ? {
            text: title,
            textStyle: {
              color: '#94a3b8',
              fontSize: 14,
              fontWeight: 'normal',
            },
            left: 'center',
            top: 0,
          }
        : undefined,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        textStyle: {
          color: '#e2e8f0',
        },
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 40,
        bottom: 20,
        textStyle: {
          color: '#94a3b8',
          fontSize: 11,
        },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 8,
      },
      series: [
        {
          name: '行业分布',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['35%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0f172a',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: '#fff',
              formatter: '{b}\n{d}%',
            },
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 240, 255, 0.4)',
            },
          },
          labelLine: {
            show: false,
          },
          data: data.map((d, index) => ({
            value: d.count,
            name: d.industryName,
            itemStyle: {
              color: colors[index % colors.length],
            },
          })),
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: (_idx: number) => _idx * 100,
          animationDuration: 1500,
        },
      ],
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
