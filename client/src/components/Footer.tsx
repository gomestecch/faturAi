export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AnalisaGastos. Seus dados permanecem seguros no seu dispositivo.
        </p>
      </div>
    </footer>
  );
}
