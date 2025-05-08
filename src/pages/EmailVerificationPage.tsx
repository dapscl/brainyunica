
import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import EmailVerifier from '@/components/EmailVerifier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check, X, Upload, Download, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { verifyEmail, VerificationResult, VerificationService } from '@/services/emailVerificationService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EmailVerificationPage = () => {
  const [activeTab, setActiveTab] = useState<string>('single');
  const [emails, setEmails] = useState<string>('');
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [service, setService] = useState<VerificationService>('hunter');
  const [apiKey, setApiKey] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSingleVerification = (result: VerificationResult) => {
    // Actualizar los resultados cuando se verifica un email individual
    setResults([result]);
  };

  const handleBulkVerification = async () => {
    if (!emails.trim()) {
      toast({
        title: "Sin emails para verificar",
        description: "Por favor ingrese al menos un email para verificar",
        variant: "destructive",
      });
      return;
    }

    // Obtener lista de emails (separados por comas, espacios o nuevas líneas)
    const emailList = emails
      .split(/[\s,;]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (emailList.length === 0) {
      toast({
        title: "Sin emails válidos",
        description: "No se encontraron emails válidos para verificar",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setResults([]);
    setProgress(0);

    const newResults: VerificationResult[] = [];
    
    try {
      // Procesar cada email uno por uno
      for (let i = 0; i < emailList.length; i++) {
        const email = emailList[i];
        const result = await verifyEmail(email, service, apiKey || undefined);
        newResults.push({ ...result, email });
        
        // Actualizar progreso
        const newProgress = Math.round(((i + 1) / emailList.length) * 100);
        setProgress(newProgress);
        setResults([...newResults]);
      }

      toast({
        title: "Verificación completada",
        description: `Se han verificado ${emailList.length} emails`,
      });
    } catch (error) {
      console.error("Error en verificación por lotes:", error);
      toast({
        title: "Error en verificación",
        description: "Ocurrió un error durante la verificación por lotes",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      setProgress(100);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Suponemos que el archivo tiene un email por línea
      setEmails(content);
      toast({
        title: "Archivo cargado",
        description: `Se ha cargado el archivo ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const downloadResults = () => {
    if (results.length === 0) {
      toast({
        title: "Sin resultados para descargar",
        description: "Verifique al menos un email primero",
        variant: "destructive",
      });
      return;
    }

    // Crear contenido CSV
    const headers = "Email,Valid,Score,Reason,MX Valid,SPF Valid,DMARC,Is Disposable,Is Role Account\n";
    const rows = results.map(r => {
      return [
        r.email || 'unknown',
        r.isValid,
        r.score || 'N/A',
        r.reason || 'N/A',
        r.domain?.hasValidMx || 'N/A',
        r.domain?.hasValidSpf || 'N/A',
        r.domain?.hasDmarc || 'N/A',
        r.isDisposable || 'N/A',
        r.isRoleAccount || 'N/A',
      ].join(",");
    }).join("\n");

    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "email_verification_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (isValid: boolean) => {
    return isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Verificación de Emails</h1>
        
        <div className="mb-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="single">Email Individual</TabsTrigger>
              <TabsTrigger value="bulk">Verificación en Lote</TabsTrigger>
            </TabsList>
            
            <TabsContent value="single">
              <EmailVerifier onVerified={handleSingleVerification} />
            </TabsContent>
            
            <TabsContent value="bulk">
              <Card>
                <CardHeader>
                  <CardTitle>Verificación de Emails en Lote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Servicio de Verificación
                      </label>
                      <Select value={service} onValueChange={(val) => setService(val as VerificationService)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hunter">Hunter.io</SelectItem>
                          <SelectItem value="clearout">Clearout</SelectItem>
                          <SelectItem value="neverbounce">NeverBounce</SelectItem>
                          <SelectItem value="truemail">TrueMail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        API Key
                      </label>
                      <Input
                        type="password"
                        placeholder="Ingrese su API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Emails a verificar
                      </label>
                      <div className="flex items-center space-x-2 mb-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-1" /> Importar CSV
                        </Button>
                        <Input 
                          type="file" 
                          ref={fileInputRef}
                          className="hidden" 
                          accept=".csv,.txt"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <Textarea
                        placeholder="Ingrese emails separados por comas o nuevas líneas..."
                        rows={6}
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Se puede ingresar un email por línea o separados por comas
                      </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setEmails('')}>
                        Limpiar
                      </Button>
                      <Button 
                        onClick={handleBulkVerification}
                        disabled={isVerifying || !emails.trim()}
                      >
                        {isVerifying ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Verificando ({progress}%)
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Iniciar Verificación
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {isVerifying && (
                      <div className="mt-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {results.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium">Resultados ({results.length})</h3>
                        <Button variant="outline" size="sm" onClick={downloadResults}>
                          <Download className="h-4 w-4 mr-1" /> Exportar CSV
                        </Button>
                      </div>
                      
                      <div className="border rounded-md overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-center">Estado</th>
                                <th className="px-4 py-2 text-center">Score</th>
                                <th className="px-4 py-2 text-left">Razón</th>
                                <th className="px-4 py-2 text-center">Registros DNS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.map((result, index) => (
                                <tr key={index} className="border-t">
                                  <td className="px-4 py-2">{result.email || 'N/A'}</td>
                                  <td className="px-4 py-2 text-center">
                                    <Badge variant="outline" className={getStatusColor(result.isValid)}>
                                      {result.isValid ? 'Válido' : 'Inválido'}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {result.score !== undefined ? result.score : 'N/A'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {result.reason || 'N/A'}
                                  </td>
                                  <td className="px-4 py-2">
                                    <div className="flex items-center justify-center space-x-2">
                                      {result.domain && (
                                        <>
                                          <div title="MX Record" className={`h-2 w-2 rounded-full ${result.domain.hasValidMx ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                          <div title="SPF Record" className={`h-2 w-2 rounded-full ${result.domain.hasValidSpf ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                          {result.domain.hasDmarc !== undefined && (
                                            <div title="DMARC Record" className={`h-2 w-2 rounded-full ${result.domain.hasDmarc ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="p-3 rounded-md bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium">Resumen de resultados</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Emails válidos</p>
                            <p className="text-lg font-medium">{results.filter(r => r.isValid).length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Emails inválidos</p>
                            <p className="text-lg font-medium">{results.filter(r => !r.isValid).length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Score promedio</p>
                            <p className="text-lg font-medium">
                              {Math.round(
                                results.reduce((acc, r) => acc + (r.score || 0), 0) / 
                                results.filter(r => r.score !== undefined).length
                              ) || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
