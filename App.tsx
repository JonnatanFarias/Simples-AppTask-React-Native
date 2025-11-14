import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Alert,
  ListRenderItemInfo,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [remainingCount, setRemainingCount] = useState(0);

  useEffect(function () {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].done) {
        count = count + 1;
      }
    }
    setRemainingCount(count);
  }, [tasks]);

  function handleAdd() {
    const title = text.trim();
    if (!title) return;

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t.title.toLowerCase() === title.toLowerCase()) {
        Alert.alert("Tarefa já existe", "Você já adicionou essa tarefa.");
        return;
      }
    }

    const newTask: Task = { id: String(Date.now()), title, done: false };

    const novaLista: Task[] = [newTask];
    for (let i = 0; i < tasks.length; i++) {
      novaLista.push(tasks[i]);
    }
    setTasks(novaLista);
    setText("");
    Keyboard.dismiss();
  }

  function handleToggle(id: string) {
    const novaLista: Task[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t.id === id) {
        const alterada: Task = { id: t.id, title: t.title, done: !t.done };
        novaLista.push(alterada);
      } else {
        novaLista.push(t);
      }
    }
    setTasks(novaLista);
  }

  function handleRemove(id: string) {
    const novaLista: Task[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (t.id !== id) {
        novaLista.push(t);
      }
    }
    setTasks(novaLista);
  }

  function renderItem(info: ListRenderItemInfo<Task>) {
    const item = info.item;
    return (
      <View style={styles.taskCard}>
        <TouchableOpacity
          style={[styles.checkbox, item.done ? styles.checkboxDone : null]}
          onPress={function () {
            handleToggle(item.id);
          }}
          accessibilityRole="button"
          accessibilityLabel={item.done ? "Marcar como não concluída" : "Marcar como concluída"}
        >
          {item.done ? <Ionicons name="checkmark" size={16} /> : null}
        </TouchableOpacity>

        <Text style={[styles.taskText, item.done ? styles.taskTextDone : null]}>
          {item.title}
        </Text>

        <TouchableOpacity
          onPress={function () {
            handleRemove(item.id);
          }}
          style={styles.trashBtn}
          accessibilityRole="button"
          accessibilityLabel="Remover tarefa"
        >
          <Ionicons name="trash-outline" size={20} />
        </TouchableOpacity>
      </View>
    );
  }

  function keyExtractor(item: Task) {
    return item.id;
  }

  return (
    <SafeAreaView style={styles.container}>


      {/* Logo */}
      <View style={styles.topo}>
        <Image
          style={styles.logo}
          source={{ uri: 'https://daniel-abella.com/unifacisa/python/img/logo/logo-ads.png' }}
        />
        <Text style={styles.title}>Bem-vindo ao App ADS</Text>
        <Text style={styles.subtitle}>Exemplo de appTask com React Native</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="O que precisa ser feito?"
          value={text}
          onChangeText={function (v) {
            setText(v);
          }}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Ionicons name="add" size={24} />
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>
        {remainingCount} {remainingCount === 1 ? "tarefa ativa" : "tarefas ativas"}
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma tarefa ainda. Adicione a primeira!</Text>
        }
      />
    </SafeAreaView>
  );
}

const radius = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 16,
  },
  topo:{
    alignItems:'center'
  },
  logo: {
    width: 260,
    height: 90,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: radius,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: "#e3e8ef",
  },
  addBtn: {
    height: 44,
    width: 44,
    backgroundColor: "white",
    borderRadius: radius,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e3e8ef",
  },
  counter: {
    marginTop: 10,
    marginBottom: 6,
    color: "#6b7280",
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: radius,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#e3e8ef",
  },
  checkbox: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "white",
  },
  checkboxDone: {
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  trashBtn: {
    padding: 6,
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 24,
  },
});
