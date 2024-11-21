import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

type Props = {
  options: any[];
  labelKey: string;
  onChange: (selected: any) => any;
  onSearch?: (search: string) => any;
  placeholder?: string;
  allowSearch?: boolean;
  label?: string;
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function Select({
  options,
  label,
  labelKey,
  placeholder = "Selecione...",
  onChange,
  onSearch,
  allowSearch = true,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debouncedSearch = debounce((text: string) => onSearch?.(text), 500);

  const handleSearch = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleSelect = (item: any) => {
    setSelectedValue(item);
    setIsDropdownOpen(false);
    setSearchText("");

    onChange(item);
  };

  const finalPlaceholder = useMemo(() => {
    if (!selectedValue) return placeholder;
    return typeof selectedValue === "object"
      ? selectedValue[labelKey]
      : selectedValue;
  }, [selectedValue]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.inputText}>{finalPlaceholder}</Text>
        </TouchableOpacity>
      </View>

      {isDropdownOpen && (
        <View style={styles.dropdown}>
          {allowSearch && (
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              value={searchText}
              onChangeText={handleSearch}
            />
          )}
          <FlatList
            data={options}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>
                  {typeof item === "object" ? item[labelKey] : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    marginVertical: 10,
  },
  label: {
    marginBottom: 8,
    color: "#000",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});
