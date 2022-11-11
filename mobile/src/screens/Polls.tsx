import { useCallback, useEffect, useState } from "react";
import { FlatList, Icon, useToast, VStack } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { api } from "../services/api";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PollCard, PollCardProps } from "../components/PollCard";
import { EmptyPollList } from "../components/EmptyPollList";
import { Loading } from "../components/Loading";

export function Polls() {
  const [polls, setPolls] = useState<PollCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { navigate } = useNavigation();

  useFocusEffect(useCallback(() => {
    fetchPolls();
  }, []));

  async function fetchPolls() {
    try {
      setIsLoading(true);

      const { data } = await api.get("/polls");
      setPolls(data);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os bolões!",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate("find")}
        />
      </VStack>

      {
        isLoading
          ? <Loading />
          : <FlatList
            data={polls}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PollCard
                data={item}
                onPress={() => navigate("details", { id: item.id })}
              />
            )}
            px={5}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 10 }}
            ListEmptyComponent={() => <EmptyPollList />}
          />
      }

    </VStack>
  );
}