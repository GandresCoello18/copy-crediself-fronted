/* eslint-disable @typescript-eslint/no-use-before-define */
import { useTheme } from '@material-ui/core';
import React from 'react';
import { Line } from 'react-chartjs-2';

interface Props {
  data: number[];
  labels: string[];
  label: string;
}

export const GraficoLineTemplate = ({ data, labels, label }: Props) => {
  const theme = useTheme();

  const options = {
    animation: false,
    cornerRadius: 10,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.primary,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.primary,
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            borderDash: [8],
            borderDashOffset: [2],
            color: theme.palette.primary,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider,
          },
        },
      ],
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.primary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary,
    },
  };
  return (
    <Line
      data={{
        datasets: [
          {
            backgroundColor: 'rgba(9,116,142,0.6)',
            data,
            label,
          },
        ],
        labels,
      }}
      width={100}
      options={options}
    />
  );
};
