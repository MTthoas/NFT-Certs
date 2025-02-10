'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { useEffect } from 'react';
// import { ethers } from 'ethers';

interface NftData {
  studentId: string;
  Program: string;
  year: string;
  programStatus: {
    status: string;
    comments: string;
  };
  ipfsCID: string;
}

export default function Home() {
  const [studentId, setStudentId] = useState('');
  const [nftData, setNftData] = useState<NftData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchNftData = async () => {
    if (!studentId) return;
    setError(null);
    setNftData(null);
    try {
      const response = await fetch(`/api/nft?studentId=${studentId}`);
      if (!response.ok) {
        throw new Error('ID étudiant non trouvé');
      }
      const data: NftData = await response.json();
      setNftData(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vérification des certificats académiques</h1>
      <div className="flex space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Entrez l'ID étudiant"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Button onClick={fetchNftData}>Vérifier</Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {nftData && (
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold">Certificat Académique</h2>
            <p><strong>Étudiant ID:</strong> {nftData.studentId}</p>
            <p><strong>Programme:</strong> {nftData.Program}</p>
            <p><strong>Année:</strong> {nftData.year}</p>
            <p><strong>Status:</strong> {nftData.programStatus.status}</p>
            <p><strong>Commentaires:</strong> {nftData.programStatus.comments}</p>
            <p><strong>IPFS CID:</strong> <a href={nftData.ipfsCID} target="_blank" rel="noopener noreferrer">{nftData.ipfsCID}</a></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
