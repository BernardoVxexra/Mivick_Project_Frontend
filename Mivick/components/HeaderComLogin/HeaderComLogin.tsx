import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '@/components/Logo';
import { styles } from './styleHeaderComLogin';
import { Ionicons } from '@expo/vector-icons';

export function HeaderComLogin() {  
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      {/* Logo + Nome */}
      <View style={styles.logoContainer}>
         <TouchableOpacity onPress={() => router.push('/')}>
                <Logo />
          </TouchableOpacity>
      </View>

      {/* Botão menu sanduíche */}
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal do menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/home1');
              }}
            >
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/contato'); // ✅ rota contatos
              }}
            >
              <Text style={styles.menuText}>Contatos</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
