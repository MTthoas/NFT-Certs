'use client'
import { wagmiContractConfig } from '@/abi/contract';
import { SelectDropdown } from '@/components/select-dropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { uploadJson } from '@/hooks/pinata';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Address } from 'viem';
import { useWriteContract } from 'wagmi';
import { degreesYears } from '../data/data';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: any;
}

export function AcademicProgressDialog({ open, onOpenChange, data }: Props) {
    // Initialisation du formulaire avec react-hook-form
    const methods = useForm();

    // Les états pour gérer les valeurs du formulaire (ou vous pouvez utiliser react-hook-form pour gérer les champs)
    const [studentId, setStudentId] = useState('');
    const [year, setYear] = useState('');
    const [nftId, setNftId] = useState('');
    const [ipfsCid, setIpfsCid] = useState('');

    console.log(data)

    const { writeContract } = useWriteContract();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with values:', { studentId, year, nftId, ipfsCid });
        try {
            const hash = await uploadJson({
                name: 'academic_progress.json',
                description: 'Academic Progress Data',
                image: 'https://static1.squarespace.com/static/5fa175aaf96cad0532ce2969/6148561302b5d728b97e0788/614860d0577319490167b0c9/1706281940014/ESGI.png?format=1500w',
                data: {
                    address: values.address,
                    studentId: values.studentId,
                    program: values.program,
                    programStatus: values.programStatus,
                    issuer: 'ESGI',
                    academicProgress: [],
                },
            });

            console.log('Uploaded to IPFS:', hash);

            const url = `https://bronze-wonderful-centipede-191.mypinata.cloud/ipfs/${hash}`;

            writeContract({
                address: wagmiContractConfig.address,
                abi: wagmiContractConfig.abi,
                functionName: 'mintPerformance',
                args: [data.owner as Address, data?.tokenId, hash],
            });

            toast({
                title: 'Academic Progress Added',
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify({ studentId, year, nftId, ipfsCid }, null, 2)}</code>
                    </pre>
                ),
            });

            // Réinitialisation des valeurs
            setStudentId('');
            setYear('');
            setNftId('');
            setIpfsCid('');
            setTimeout(() => onOpenChange(false), 100);

        } catch (err) {
            console.error('Error while adding academic progress:', err);
            alert('Error while adding academic progress');
        }
    };

    return (
        <FormProvider {...methods}>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="text-left">
                        <DialogTitle>Add Academic Progress - NFT: {String(data?.tokenId)}</DialogTitle>
                        <DialogDescription>
                            Fill the form to add an academic progress entry.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
                        <form onSubmit={handleSubmit} className="space-y-4 p-0.5">
                            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                                <label className="col-span-2 text-right">Student ID</label>
                                <Input
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="Student ID"
                                    className="col-span-4"
                                />
                            </div>

                            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                                <label className="col-span-2 text-right">Year</label>
                                <SelectDropdown
                                    defaultValue={year}
                                    onValueChange={setYear}
                                    placeholder="Select year"
                                    className="col-span-4"
                                    items={degreesYears.map(({ label, value }) => ({
                                        label,
                                        value,
                                    }))}
                                />
                            </div>

                            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                                <label className="col-span-2 text-right">NFT ID</label>
                                <Input
                                    value={nftId}
                                    onChange={(e) => setNftId(e.target.value)}
                                    placeholder="NFT ID"
                                    className="col-span-4"
                                />
                            </div>

                            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
                                <label className="col-span-2 text-right">IPFS CID</label>
                                <Input
                                    value={ipfsCid}
                                    onChange={(e) => setIpfsCid(e.target.value)}
                                    placeholder="IPFS Link"
                                    className="col-span-4"
                                />
                            </div>

                            <Button type="submit" className="mt-4 w-full">
                                Save Academic Progress
                            </Button>
                        </form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </FormProvider>
    );
}
