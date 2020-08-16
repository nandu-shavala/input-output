import { Injectable } from '@angular/core';
import * as echarts from "echarts";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  public loadChartData(
    data: any,
    label: string,
    xLabel: string,
    grid: any,
    lineColor = "#007bff",
    stacked = false
  ) {

    let series = []
    let legend = {

      show: stacked,
      bottom: 0
    }

    if (!stacked) {
      series.push({
        name: label,
        type: "line",
        smooth: false,
        animation: false,
        symbol: "diamond",
        symbolSize: 10,
        lineStyle: { color: this.colorLuminance(lineColor, -0.4) },

        itemStyle: {
          normal: {
            color: lineColor,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.82, [
                {
                  offset: 0,
                  color: this.colorLuminance(lineColor, 0.9),
                },
                {
                  offset: 1,
                  color: "rgb(255, 255, 255)",
                },
              ]),
            },
          },
        },
        data: data.yAxis,
      }
      )
    }

    else {
      data.yAxis.map((obj, i) => {
        series.push({
          name: obj.name,
          type: obj.type,
          smooth: false,
          animation: false,
          symbol: "diamond",
          symbolSize: 10,
          lineStyle: { color: this.colorLuminance(obj.color, -0.4) },

          itemStyle: {
            normal: {
              color: obj.color,
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 0.82, [
                  {
                    offset: 0,
                    color: this.colorLuminance(obj.color, 0.9),
                  },
                  {
                    offset: 1,
                    color: "rgb(255, 255, 255)",
                  },
                ]),
              },
            },
          },
          data: obj.data,
        }
        )
      })
    }

    return {
      legend: legend,
      tooltip: {
        trigger: "axis",
        renderMode: "html",
        extraCssText:
          "font-size:11px;font-weight:500;box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.09019607843137255);border-radius:30px",
        formatter: function (a, b, c) {
          if (Array.isArray(a)) {
            return "<table cellpadding='0' cellspacing='0'>" +
              (a.map(s => `<tr><td>${s.seriesName}:</td><td>${s.data} ${data.unit ?? ''}</td>`)).join("") +
              "</table>"
          }
          //
        },
        position: function (pt: number[], params, element, rect, size: any) {
          let top = -10;
          //right
          if (pt[0] + size.contentSize[0] / 2 > size.viewSize[0] - 25) return [pt[0] - size.contentSize[0] + 10, top];
          //center
          else if (pt[0] - size.contentSize[0] / 2 > Number(grid.left) + 25) return [pt[0] - size.contentSize[0] / 2, top];
          //left
          else return [pt[0] - 10, top];
        },
        backgroundColor: "rgba(255,255,255, 0.8)",
        textStyle: {
          color: "black",
        },
      },
      grid: {
        top: Number(grid.top),
        left: Number(grid.left),
        bottom: stacked ? 50 : 30,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        name: xLabel,
        nameLocation: "middle",
        axisTick: {
          alignWithLabel: true
        },
        // boundaryGap: false,
        // min: 0,
        nameTextStyle: {
          color: "#bfbbbb",
        },
        nameGap: 30,
        data: data.xAxis,

        axisLine: {
          lineStyle: {
            color: "#888",
          },
        },
        // name: 'x-Axis',

        axisLabel: {
          fontSize: 10,
          color: "#000000",
        },
      },
      yAxis: {
        name: label,
        nameLocation: "middle",
        // splitNumber: 5,
        // min: 'dataMin',
        // interval: this.calculateInterval(data.yAxis),
        nameGap: 40,
        nameTextStyle: {
          color: "#bfbbbb",
        },
        splitLine: {
          lineStyle: {
            color: "none",
          },
        },

        axisLine: {
          lineStyle: {
            color: "#888",
          },
        },
        axisLabel: {
          fontSize: 10,
          color: "#000000",
        },
      },
      axisPointer: {
        lineStyle: {
          type: "dotted",
        },
      },
      series: series,
      animation: false,
    } as echarts.EChartOption;
  }

  public colorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }

    return rgb;
  }

  public calcPercentWidth(issuePercent) {
    var lowerThreshold = 12;
    var upperThreshold = -5;
    var result = issuePercent != 0 ? (issuePercent * (upperThreshold - lowerThreshold) / 100) + lowerThreshold : 0
    return `calc(${issuePercent}% + ${result}%)`;
  }

  public getStatusStyle(status: string) {
    if (status.toLowerCase() == "in progress") {
      return "label shadow-style bg-yellow text-black";
    } else if (status.toLowerCase() == "closed") {
      return "label shadow-style bg-green text-black";
    } else if (status.toLowerCase() == "open") {
      return "label shadow-style bg-blue text-black";
    } else {
      return "label shadow-style bg-orange text-black";
    }
  }

  public getImgPathForRFB(typeOfIssue) {
    switch (typeOfIssue) {
      case "Driver availability":
        return "assets/images/icon/driver_availability.png"
      case "Low average speed":
        return "assets/images/icon/low_average_speed.png"
      case "Vehicle issue":
        return "assets/images/icon/car_repair.png"
      default:
        return "assets/images/icon/car.png";
    }
  }

  public getImgPathForOSD(typeOfIssue) {
    switch (typeOfIssue) {
      case "Exerience Driver":
        return "assets/images/icon/exerience_driver.png"
      case "New Driver":
        return "assets/images/icon/new_driver.png"
      default:
        return "assets/images/icon/car.png";
    }
  }

  public getImage(name: string) {
    switch (name.toLowerCase()) {
      case "hari":
        return "background-image: url(https://randomuser.me/api/portraits/men/5.jpg); background-size: cover;";
      case "venkat":
        return "background-image: url(https://randomuser.me/api/portraits/men/9.jpg); background-size: cover;";
      case "sankaran":
        return "background-image: url(https://randomuser.me/api/portraits/men/26.jpg); background-size: cover;";
      case "vijay":
        return "background-image: url(https://randomuser.me/api/portraits/men/29.jpg); background-size: cover;";
      default:
        return "background-image: url(assets/images/icon/user_header.png); background-size: cover;";
        break;
    }
  }
}
