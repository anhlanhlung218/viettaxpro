
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Info, 
  ArrowRightLeft, 
  Users, 
  ShieldCheck, 
  TrendingUp,
  CreditCard,
  Sparkles,
  ChevronDown,
  Building2,
  Wallet,
  Briefcase,
  FileText,
  HelpCircle,
  ArrowUpRight,
  RefreshCcw,
  Plus
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';
import { Region, CalculationInputs, TaxResult } from './types';
import { calculateGrossToNet, calculateNetToGross } from './utils/taxCalculator';
import { getTaxAdvice } from './services/geminiService';

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calc' | 'compare' | 'annual'>('calc');
  const [inputs, setInputs] = useState<CalculationInputs>({
    salary: 25000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full'
  });

  const [compInputs, setCompInputs] = useState<CalculationInputs>({
    salary: 30000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full'
  });

  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const result = useMemo(() => {
    return inputs.isGrossToNet ? calculateGrossToNet(inputs) : calculateNetToGross(inputs);
  }, [inputs]);

  const compResult = useMemo(() => {
    return compInputs.isGrossToNet ? calculateGrossToNet(compInputs) : calculateNetToGross(compInputs);
  }, [compInputs]);

  const handleFetchAdvice = async () => {
    setLoadingAdvice(true);
    const text = await getTaxAdvice(result);
    setAdvice(text || '');
    setLoadingAdvice(false);
  };

  const chartData = [
    { name: 'Lương Net', value: result.netSalary },
    { name: 'Bảo hiểm', value: result.socialInsurance + result.healthInsurance + result.unemploymentInsurance },
    { name: 'Thuế TNCN', value: result.personalIncomeTax },
  ];

  const compareChartData = [
    { 
      name: 'Phương án 1', 
      net: result.netSalary, 
      tax: result.personalIncomeTax, 
      ins: result.socialInsurance + result.healthInsurance + result.unemploymentInsurance 
    },
    { 
      name: 'Phương án 2', 
      net: compResult.netSalary, 
      tax: compResult.personalIncomeTax, 
      ins: compResult.socialInsurance + compResult.healthInsurance + compResult.unemploymentInsurance 
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">VietTax Pro</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Vietnam Tax Intelligence</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('calc')}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'calc' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Máy tính thuế
            </button>
            <button 
              onClick={() => setActiveTab('compare')}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'compare' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              So sánh lương
            </button>
            <button 
              onClick={() => setActiveTab('annual')}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'annual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Kế hoạch năm
            </button>
          </nav>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-bold">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            QUY ĐỊNH 2024 CẬP NHẬT
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
        
        {activeTab === 'calc' && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Input Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    Cấu hình lương
                  </h2>
                  <button 
                    onClick={() => setInputs(p => ({ ...p, isGrossToNet: !p.isGrossToNet }))}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                    title="Đổi chiều tính toán"
                  >
                    <ArrowRightLeft className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                      Mức lương {inputs.isGrossToNet ? '(Gross)' : '(Net)'}
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={inputs.salary}
                        onChange={(e) => setInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                        className="w-full pl-6 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all text-xl font-bold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₫</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Người phụ thuộc</label>
                      <select 
                        value={inputs.dependents}
                        onChange={(e) => setInputs(p => ({ ...p, dependents: Number(e.target.value) }))}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
                      >
                        {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v} người</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Vùng tối thiểu</label>
                      <select 
                        value={inputs.region}
                        onChange={(e) => setInputs(p => ({ ...p, region: e.target.value as Region }))}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
                      >
                        {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                      Lương đóng bảo hiểm
                      <HelpCircle className="w-4 h-4 text-slate-300" />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setInputs(p => ({ ...p, insuranceSalary: 'full' }))}
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${inputs.insuranceSalary === 'full' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                      >
                        Toàn bộ lương
                      </button>
                      <button 
                        onClick={() => setInputs(p => ({ ...p, insuranceSalary: inputs.salary }))}
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${inputs.insuranceSalary !== 'full' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                      >
                        Tùy chỉnh
                      </button>
                    </div>
                    {inputs.insuranceSalary !== 'full' && (
                      <input 
                        type="number"
                        placeholder="Mức đóng..."
                        value={typeof inputs.insuranceSalary === 'number' ? inputs.insuranceSalary : ''}
                        onChange={(e) => setInputs(p => ({ ...p, insuranceSalary: Number(e.target.value) }))}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <Sparkles className="absolute -right-2 -top-2 w-20 h-20 text-white/10" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Cơ sở Pháp lý
                </h3>
                <div className="space-y-3 text-sm text-indigo-100">
                  <div className="flex justify-between items-center border-b border-indigo-500/50 pb-2">
                    <span>Lương cơ sở</span>
                    <span className="font-bold">2.340.000₫</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-indigo-500/50 pb-2">
                    <span>Giảm trừ bản thân</span>
                    <span className="font-bold">11.000.000₫</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span>Giảm trừ phụ thuộc</span>
                    <span className="font-bold">4.400.000₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Main Summary Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col justify-between">
                  <div>
                    <div className="bg-emerald-100 text-emerald-700 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4">Lương Thực Nhận (Net)</div>
                    <div className="text-4xl font-black text-slate-900 leading-tight">
                      {result.netSalary.toLocaleString()}<span className="text-xl text-slate-400 ml-1 font-bold">₫</span>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    Bằng {((result.netSalary/result.grossSalary)*100).toFixed(1)}% lương Gross
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                   <div className="bg-rose-100 text-rose-700 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4">Thuế & Bảo hiểm</div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-slate-500 font-bold text-sm">Thuế TNCN</span>
                        <span className="text-xl font-black text-rose-600">{result.personalIncomeTax.toLocaleString()}₫</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-slate-500 font-bold text-sm">Bảo hiểm (10.5%)</span>
                        <span className="text-xl font-black text-blue-600">{(result.socialInsurance + result.healthInsurance + result.unemploymentInsurance).toLocaleString()}₫</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Employer Cost Widget */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-xl font-bold">Chi phí cho Doanh nghiệp</h2>
                  </div>
                  <div className="text-xs font-bold text-slate-400 px-3 py-1 bg-white/5 rounded-full uppercase">Tổng cộng: {result.totalEmployerCost.toLocaleString()}₫</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase">BHXH (17.5%)</p>
                    <p className="text-lg font-bold">{result.employerSocialIns.toLocaleString()}₫</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase">BHYT (3%)</p>
                    <p className="text-lg font-bold">{result.employerHealthIns.toLocaleString()}₫</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase">BHTN (1%)</p>
                    <p className="text-lg font-bold">{result.employerUnemploymentIns.toLocaleString()}₫</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase">KPCĐ (2%)</p>
                    <p className="text-lg font-bold">{result.employerTradeUnion.toLocaleString()}₫</p>
                  </div>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Chi tiết bảng lương
                  </h3>
                  <button className="text-indigo-600 text-xs font-bold hover:underline">In phiếu lương</button>
                </div>
                <div className="p-6">
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-500">Lương Gross</span>
                      <span className="font-bold">{result.grossSalary.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-500 flex items-center gap-2">BHXH (8%) <Info className="w-3 h-3 cursor-help"/></span>
                      <span className="text-rose-600">-{result.socialInsurance.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-500">BHYT (1.5%)</span>
                      <span className="text-rose-600">-{result.healthInsurance.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-500">BHTN (1%)</span>
                      <span className="text-rose-600">-{result.unemploymentInsurance.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100 bg-slate-50 px-4 rounded-xl">
                      <span className="text-slate-700 font-bold">Thu nhập trước thuế</span>
                      <span className="font-bold">{result.incomeBeforeTax.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-500 italic">Giảm trừ gia cảnh:</span>
                      <span className="text-emerald-600">-{(result.selfDeduction + result.dependentDeduction).toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100 bg-indigo-50 px-4 rounded-xl">
                      <span className="text-indigo-700 font-bold">Thu nhập tính thuế</span>
                      <span className="font-black text-indigo-700">{result.taxableIncome.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-slate-500">Thuế TNCN phải nộp</span>
                      <span className="text-rose-600 font-bold">-{result.personalIncomeTax.toLocaleString()} đ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Bracket Math Explain */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" />
                  Diễn giải cách tính Thuế TNCN
                </h3>
                <div className="space-y-4">
                  {result.taxSteps.map(step => (
                    <div key={step.level} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                      <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center font-black text-indigo-600 border border-slate-100">
                        {step.level}
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-black text-slate-400 uppercase">{step.range}</p>
                        <p className="text-sm font-bold text-slate-700">Thuế suất {step.rate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{step.amount.toLocaleString()}₫</p>
                      </div>
                    </div>
                  ))}
                  {result.taxSteps.length === 0 && <p className="text-center py-8 text-slate-400 italic">Thu nhập của bạn chưa nằm trong diện chịu thuế TNCN.</p>}
                </div>
              </div>

              {/* AI Expert Section */}
              <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800">Cố vấn Thuế AI</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phân tích chuyên sâu 2024</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleFetchAdvice}
                      disabled={loadingAdvice}
                      className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-all disabled:opacity-50"
                    >
                      {loadingAdvice ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {advice ? 'Phân tích lại' : 'Bắt đầu tư vấn'}
                    </button>
                  </div>
                  {advice ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-slate-700 leading-relaxed text-sm whitespace-pre-wrap animate-in slide-in-from-bottom-4 duration-500">
                      {advice}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-300">
                      <p className="font-bold italic">AI sẽ phân tích con số của bạn và đưa ra lời khuyên tối ưu thuế...</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
             <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <h3 className="font-black text-slate-800">Phương án 1</h3>
                  </div>
                  <input 
                    type="number" 
                    value={inputs.salary}
                    onChange={(e) => setInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                    className="w-full text-2xl font-black p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl">
                      Net: {result.netSalary.toLocaleString()}₫
                    </div>
                    <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl">
                      Thuế: {result.personalIncomeTax.toLocaleString()}₫
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h3 className="font-black text-slate-800">Phương án 2</h3>
                  </div>
                  <input 
                    type="number" 
                    value={compInputs.salary}
                    onChange={(e) => setCompInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                    className="w-full text-2xl font-black p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl">
                      Net: {compResult.netSalary.toLocaleString()}₫
                    </div>
                    <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl">
                      Thuế: {compResult.personalIncomeTax.toLocaleString()}₫
                    </div>
                  </div>
                </div>
             </div>

             <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-black mb-8">Biểu đồ so sánh trực quan</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend iconType="circle" />
                      <Bar dataKey="net" fill="#10b981" name="Lương Net" radius={[8, 8, 0, 0]} barSize={60} />
                      <Bar dataKey="tax" fill="#ef4444" name="Thuế TNCN" radius={[8, 8, 0, 0]} barSize={60} />
                      <Bar dataKey="ins" fill="#3b82f6" name="Bảo hiểm" radius={[8, 8, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white text-center">
                   <p className="text-slate-400 font-bold text-sm uppercase mb-2">Chênh lệch thu nhập (Net)</p>
                   <p className="text-3xl font-black">
                    {Math.abs(result.netSalary - compResult.netSalary).toLocaleString()}₫ / tháng
                   </p>
                   <p className="text-xs text-indigo-400 mt-2 font-bold">
                    Tương đương {Math.abs(result.netSalary - compResult.netSalary) * 12.toLocaleString()}₫ / năm
                   </p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'annual' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in fade-in duration-500">
             <div className="flex items-center gap-4 mb-12">
               <Wallet className="w-10 h-10 text-indigo-600" />
               <div>
                  <h2 className="text-2xl font-black text-slate-800">Dự phóng Tài chính Năm</h2>
                  <p className="text-slate-500 font-medium">Tổng kết thu nhập 12 tháng + Thưởng 13</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4 space-y-8">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase mb-4">Lương tháng 13 & Thưởng</p>
                      <input 
                        type="number"
                        placeholder="Nhập mức thưởng..."
                        className="w-full text-xl font-black p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500"
                      />
                      <p className="text-[10px] text-slate-400 mt-3 italic">* Thưởng thường được cộng dồn vào thu nhập tính thuế tháng chi trả.</p>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl">
                         <p className="text-xs font-bold text-emerald-600 mb-1">Tổng Net Năm (Dự kiến)</p>
                         <p className="text-2xl font-black text-emerald-800">{(result.netSalary * 13).toLocaleString()}₫</p>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-2xl">
                         <p className="text-xs font-bold text-rose-600 mb-1">Tổng Thuế Năm (Dự kiến)</p>
                         <p className="text-2xl font-black text-rose-800">{(result.personalIncomeTax * 13).toLocaleString()}₫</p>
                      </div>
                   </div>
                </div>

                <div className="md:col-span-8">
                   <h3 className="font-bold mb-6">Lộ trình tích lũy tài sản (Dự kiến)</h3>
                   <div className="h-80 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 font-bold italic border-2 border-dashed border-slate-200">
                      [Tính năng Đồ thị Tích lũy Năm đang được nâng cấp...]
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
             <div className="col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-slate-800 p-1.5 rounded-lg text-white">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">VietTax Pro</h2>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                  Công cụ tính toán thuế thu nhập cá nhân thông minh hàng đầu Việt Nam. Luôn cập nhật theo các nghị định và luật thuế mới nhất của Chính phủ.
                </p>
             </div>
             <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Tài nguyên</h4>
                <ul className="space-y-4 text-sm font-semibold text-slate-600">
                  <li className="hover:text-indigo-600 cursor-pointer">Biểu thuế 2024</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Tra cứu Mã số thuế</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Hướng dẫn Quyết toán</li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-400">Pháp lý</h4>
                <ul className="space-y-4 text-sm font-semibold text-slate-600">
                  <li className="hover:text-indigo-600 cursor-pointer">Điều khoản sử dụng</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Chính sách bảo mật</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Miễn trừ trách nhiệm</li>
                </ul>
             </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:row items-center justify-between gap-6">
            <p className="text-slate-400 text-xs font-bold">© 2024 VIETTAX PRO INTELLIGENCE. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-xs font-black text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                  SSL ENCRYPTED
               </div>
               <div className="w-px h-4 bg-slate-200"></div>
               <p className="text-xs text-slate-400 font-bold uppercase">Made with ☕ in Vietnam</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
