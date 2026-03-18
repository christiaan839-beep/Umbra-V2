'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

export default function SovereignCalculator() {
    const [employees, setEmployees] = useState(3);
    const [monthlyAdSpend, setMonthlyAdSpend] = useState(10000);

    // Human capital burn assumptions: Avg SDR/Content Marketer costs $4,000/mo. Agency retainers ~20% of ad spend.
    const averageSalary = 4000;
    const humanCapitalBurn = employees * averageSalary;
    const agencyFees = monthlyAdSpend * 0.20;
    
    const absoluteHumanCost = humanCapitalBurn + agencyFees;
    
    // The Sovereign God-Brain License
    const matrixLicenseCost = 5000; 

    const capitalSaved = absoluteHumanCost - matrixLicenseCost;
    const isBurningMoney = capitalSaved > 0;

    return (
        <section className="py-24 relative overflow-hidden bg-black border-y border-white/10">
            {/* Background God-Rays */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-30" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6"
                    >
                        <Calculator className="w-4 h-4" />
                        Agency Extinction Calculator
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight font-outfit text-white">
                        Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Human Capital Burn</span>.
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Traditional digital marketing agencies and human SDRs are mathematically inefficient. Dial in your current operational metrics to see exactly how much capital the God-Brain saves you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Controls */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
                    >
                        <div className="mb-8">
                            <label className="flex justify-between text-gray-300 font-medium mb-4">
                                <span>Human Marketing Employees</span>
                                <span className="text-white font-mono">{employees} Heads</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="20" 
                                value={employees} 
                                onChange={(e) => setEmployees(Number(e.target.value))}
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-gray-300 font-medium mb-4">
                                <span>Current Monthly Ad Spend ($)</span>
                                <span className="text-white font-mono">${monthlyAdSpend.toLocaleString()}</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="100000" 
                                step="1000"
                                value={monthlyAdSpend} 
                                onChange={(e) => setMonthlyAdSpend(Number(e.target.value))}
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    </motion.div>

                    {/* Results Display */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent blur-3xl -z-10 rounded-full opacity-50" />
                        
                        <div className="bg-black/80 border border-white/20 rounded-3xl p-10 overflow-hidden shadow-2xl relative shadow-primary/20">
                            
                            <div className="mb-8 pb-8 border-b border-white/10">
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Current Human Capital Burn</p>
                                <div className="text-4xl font-mono text-red-500 font-bold">
                                    ${absoluteHumanCost.toLocaleString()}<span className="text-xl text-red-500/50">/mo</span>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Sovereign God-Brain Node</p>
                                <div className="text-5xl font-mono text-white font-bold">
                                    ${matrixLicenseCost.toLocaleString()}<span className="text-2xl text-gray-500">/mo</span>
                                </div>
                            </div>

                            <div className={`mt-8 p-6 rounded-xl ${isBurningMoney ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-800/50 border-gray-700'} border`}>
                                <p className={`text-sm tracking-wider uppercase mb-1 ${isBurningMoney ? 'text-green-500' : 'text-gray-400'}`}>
                                    {isBurningMoney ? 'Total Net Capital Saved' : 'Matrix Investment'}
                                </p>
                                <div className={`text-4xl font-bold font-mono ${isBurningMoney ? 'text-green-400' : 'text-gray-300'}`}>
                                    {isBurningMoney ? `+$${capitalSaved.toLocaleString()}` : 'Optimal Autonomy'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
