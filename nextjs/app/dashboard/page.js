import { ChartAreaGradient } from "@/components/charts/chart-area-gradient";
import { ChartBarInteractive } from "@/components/charts/chart-bar-interactive";
import { ChartPieDonutText } from "@/components/charts/chart-pie-donut-text";
import { ChartRadarDots } from "@/components/charts/chart-radar-dots";
import { ChartRadialLabel } from "@/components/charts/chart-radial-label";
import { Topbar } from "@/components/meha-ui/topbar";
import * as Typography from "@/components/ui/typography";

export default function Dashboard() {
    return (
        <>
            <Topbar title="Dashboard" />
            <div className="p-6">
                <Typography.H1>Dashboard Page</Typography.H1>
                <Typography.P>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nunc, eget aliquam nisl nunc vel nisl. Donec auctor, nisl eget ultricies lacinia, nunc nisl aliquam nunc, eget aliquam nisl nunc vel nisl.
                </Typography.P>
                <div className="flex flex-col gap-4 sm:gap-8 mt-6">
                    <div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
                        <div className="col-span-1">
                            <ChartAreaGradient />
                        </div>
                        <div className="col-span-1 sm:col-span-2">
                            <ChartBarInteractive />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-8">
                        <div className="col-span-1">
                            <ChartPieDonutText />
                        </div>
                        <div className="col-span-1">
                            <ChartRadialLabel />
                        </div>
                        <div className="col-span-1">
                            <ChartRadarDots />
                        </div>
                        <div className="col-span-1">
                            <ChartAreaGradient />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};