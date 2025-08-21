import { SQLiteProvider } from 'expo-sqlite';
import { IniciarBD } from './databases/iniciarBD';
import { Index } from './inicial';


export default function App() {
  return (
    <SQLiteProvider databaseName="meusDados.db" onInit={IniciarBD}>
      <Index />
    </SQLiteProvider>
  );
};