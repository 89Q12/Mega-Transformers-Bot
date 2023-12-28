import { useTheme } from '@emotion/react';
import { BarChart } from '../../../components/bar-chart';
import { LineChart } from '../../../components/line-chart';
import { PageSpinner } from '../../../components/page-spinner';
import { useGetAverageMessagesPerChannelPer30Days } from '../../../hooks/api/use-get-avg-msg-per-chan';
import { useGetMessagesPerDay } from '../../../hooks/api/use-get-avg-msg-per-day';
import { Box } from '@chakra-ui/layout';

const DashboardPage = () => {
  const averageMessagesPerChannelPer30Days =
    useGetAverageMessagesPerChannelPer30Days();
  const averageMessagesPerDay = useGetMessagesPerDay();
  const theme: any = useTheme();
  if (!averageMessagesPerChannelPer30Days || !averageMessagesPerDay) {
    return <PageSpinner />;
  }
  return (
    <Box>
      <BarChart
        data={averageMessagesPerChannelPer30Days!.values}
        title="Average messages per channel in the last 30 days"
        labels={averageMessagesPerChannelPer30Days!.labels}
        color={theme.colors.primary[300]}
      />
      <LineChart
        data={averageMessagesPerDay!.values}
        title="Average messages per channel in the last 30 days"
        labels={averageMessagesPerDay!.labels}
        color={theme.colors.primary[300]}
      />
    </Box>
  );
};

export default DashboardPage;
