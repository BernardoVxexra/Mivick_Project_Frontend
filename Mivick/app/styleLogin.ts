import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 32,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#F85200',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#F85200',
    marginTop: 32,
    marginBottom: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    marginTop: 16,
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
    borderColor: '#FFFFFF',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#F85200',
    borderColor: '#F85200',
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
  },
  termsText: {
    color: '#F85200',
  },
});
