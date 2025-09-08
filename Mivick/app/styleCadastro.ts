import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 32,
  },
  signupButton: {
    backgroundColor: '#F85200',
    marginTop: 32,
    marginBottom: 16,
  },
 googleButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  backgroundColor: 'transparent', // deixa o fundo transparente
  borderRadius: 8,
  marginTop: 16,
  borderColor: '#F85200', // cor da borda
  borderWidth: 2, // define a espessura da borda
},
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6D96FF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center', // centraliza o ícone
  },
  checkboxChecked: {
    backgroundColor: '#6D96FF',
    borderColor: '#FFFFFF',
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  termsText: {
    color: '#6D96FF',
  },
});
