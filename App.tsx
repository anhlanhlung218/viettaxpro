
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  ShieldCheck, 
  TrendingUp,
  CreditCard,
  Wallet,
  FileText,
  Download,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowDown,
  Shield,
  Zap,
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Region, CalculationInputs } from './types';
import { calculateGrossToNet, calculateNetToGross } from './utils/taxCalculator';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    salary: 25000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full'
  });

  const result = useMemo(() => {
    return inputs.isGrossToNet ? calculateGrossToNet(inputs) : calculateNetToGross(inputs);
  }, [inputs]);

  // Hàm định dạng tiền tệ với dấu chấm phân cách hàng nghìn (Chuẩn Việt Nam)
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("VIETTAX PRO - BAO CAO CHI TIET", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("He thong tinh thue TNCN tu dong", 105, 27, { align: 'center' });
    doc.line(20, 35, 190, 35);
    
    let y = 50;
    const addLine = (label: string, value: string) => {
      doc.text(label, 20, y);
      doc.text(value, 190, y, { align: 'right' });
      y += 10;
    };

    addLine("Luong Gross:", `${formatVND(result.grossSalary)} VND`);
    addLine("Bao hiem (10.5%):", `-${formatVND(result.socialInsurance + result.healthInsurance + result.unemploymentInsurance)} VND`);
    addLine("Giam tru gia canh:", `-${formatVND(result.selfDeduction + result.dependentDeduction)} VND`);
    addLine("Thue TNCN:", `-${formatVND(result.personalIncomeTax)} VND`);
    y += 10;
    doc.setFontSize(16);
    doc.text("LUONG THUC NHAN (NET):", 20, y);
    doc.text(`${formatVND(result.netSalary)} VND`, 190, y, { align: 'right' });
    
    doc.save(`VietTaxPro_Bao_Cao.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-[100]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">VietTax Pro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#tool" className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em]">Máy tính</a>
            <a href="#knowledge" className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em]">Kiến thức</a>
            <a href="#footer" className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em]">Liên hệ</a>
          </div>

          <button 
            onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
          >
            Tính toán ngay
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 container mx-auto px-6 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-indigo-100">
          <Zap className="w-3.5 h-3.5 fill-indigo-500" /> Cập nhật mới nhất 2024 - 2025
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-10 tracking-tighter">
          Tài chính minh bạch.<br />
          <span className="text-indigo-600">Thuế tính chuẩn xác.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          Công cụ tính lương Net sang Gross và ngược lại duy nhất bạn cần. Tất cả các bậc thuế TNCN và bảo hiểm được cập nhật tự động.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-3xl text-lg font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3"
          >
            Bắt đầu tính toán <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Main App Content - All in One Page */}
      <section id="tool" className="py-20 container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left: Input Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-100 p-10 sticky top-32">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Cấu hình lương</h3>
                <button 
                  onClick={() => setInputs(p => ({ ...p, isGrossToNet: !p.isGrossToNet }))}
                  className="flex items-center gap-2 bg-slate-50 text-slate-900 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                >
                  <ArrowRightLeft className="w-4 h-4" /> {inputs.isGrossToNet ? 'Gross sang Net' : 'Net sang Gross'}
                </button>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex justify-between">
                    Lương tháng ({inputs.isGrossToNet ? 'Gross' : 'Net'})
                    <span className="text-indigo-600">VND</span>
                  </label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={inputs.salary}
                      onChange={(e) => setInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                      className="w-full px-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-indigo-500 focus:bg-white outline-none transition-all text-4xl font-black text-slate-900"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl group-focus-within:text-indigo-500 transition-colors">₫</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Người phụ thuộc</label>
                    <select 
                      value={inputs.dependents}
                      onChange={(e) => setInputs(p => ({ ...p, dependents: Number(e.target.value) }))}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-slate-700 cursor-pointer appearance-none"
                    >
                      {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v} người</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vùng tối thiểu</label>
                    <select 
                      value={inputs.region}
                      onChange={(e) => setInputs(p => ({ ...p, region: e.target.value as Region }))}
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-slate-700 cursor-pointer appearance-none"
                    >
                      {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Cơ sở tính toán 2024</span>
                  </div>
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between border-b border-white/5 pb-3">
                      <span className="text-slate-400">Giảm trừ cá nhân:</span>
                      <span className="font-black">11.000.000 ₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mức lương cơ sở:</span>
                      <span className="font-black">2.340.000 ₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results Display */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Lương thực nhận (Net)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{formatVND(result.netSalary)}</span>
                  <span className="text-xl font-bold text-slate-300">₫</span>
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Thuế TNCN tạm tính</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-rose-600 tracking-tighter">{formatVND(result.personalIncomeTax)}</span>
                  <span className="text-xl font-bold text-rose-200">₫</span>
                </div>
              </div>
            </div>

            {/* Chi tiết khấu trừ */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Chi tiết bảng lương</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">Phân tích theo quy định nhà nước hiện hành</p>
                </div>
                <button 
                  onClick={handleExportPDF}
                  className="bg-slate-50 text-slate-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Xuất PDF
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Lương Gross", val: result.grossSalary, sub: "Tổng thu nhập doanh nghiệp chi trả", color: "text-slate-900" },
                  { label: "Bảo hiểm Xã hội (8%)", val: -result.socialInsurance, sub: "Đóng vào quỹ hưu trí & tử tuất", color: "text-rose-500" },
                  { label: "Bảo hiểm Y tế (1.5%)", val: -result.healthInsurance, sub: "Dành cho dịch vụ khám chữa bệnh", color: "text-rose-500" },
                  { label: "Bảo hiểm Thất nghiệp (1%)", val: -result.unemploymentInsurance, sub: "Hỗ trợ khi nghỉ việc", color: "text-rose-500" },
                  { label: "Thu nhập trước thuế", val: result.incomeBeforeTax, sub: "Gross - Tổng bảo hiểm", color: "text-indigo-600", isMajor: true },
                  { label: "Giảm trừ gia cảnh", val: -(result.selfDeduction + result.dependentDeduction), sub: "Mức miễn trừ thuế cho gia đình", color: "text-emerald-600" },
                  { label: "Thu nhập tính thuế", val: result.taxableIncome, sub: "Cơ sở để áp biểu thuế lũy tiến", color: "text-indigo-600", isMajor: true },
                  { label: "Thuế TNCN", val: -result.personalIncomeTax, sub: "Đóng góp ngân sách nhà nước", color: "text-rose-600" },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-6 rounded-3xl transition-all hover:bg-slate-50/50 ${item.isMajor ? 'bg-slate-50 border border-slate-100 my-4' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-1 rounded-lg ${item.val < 0 ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'}`}>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className={`text-sm font-black ${item.color}`}>{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.sub}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black ${item.color}`}>
                        {item.val < 0 ? '-' : ''}{formatVND(Math.abs(item.val))}
                        <span className="text-xs font-bold text-slate-300 ml-1.5">₫</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-10 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-3">Số tiền nhận thực tế</p>
                    <h4 className="text-4xl font-black tracking-tighter">Lương Net của bạn</h4>
                  </div>
                  <div className="text-right flex items-baseline gap-2">
                    <span className="text-5xl font-black">{formatVND(result.netSalary)}</span>
                    <span className="text-xl font-bold text-indigo-300">₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kiến thức Section */}
      <section id="knowledge" className="py-32 bg-slate-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Hiểu rõ về biểu thuế<br />lũy tiến từng phần</h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                Tại Việt Nam, thu nhập của bạn không bị đánh một mức thuế duy nhất. Hệ thống chia nhỏ thu nhập thành các "bậc" để đảm bảo người có thu nhập cao hơn sẽ đóng góp nhiều hơn.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
              <Info className="w-6 h-6 text-indigo-400" />
              <div className="text-xs font-black uppercase tracking-widest text-slate-300">Căn cứ Luật thuế TNCN</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {[
                { level: 1, range: "Đến 5 triệu ₫", rate: "5%" },
                { level: 2, range: "Trên 5 đến 10 triệu ₫", rate: "10%" },
                { level: 3, range: "Trên 10 đến 18 triệu ₫", rate: "15%" },
                { level: 4, range: "Trên 18 đến 32 triệu ₫", rate: "20%" },
                { level: 5, range: "Trên 32 đến 52 triệu ₫", rate: "25%" },
                { level: 6, range: "Trên 52 đến 80 triệu ₫", rate: "30%" },
                { level: 7, range: "Trên 80 triệu ₫", rate: "35%" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-slate-500 group-hover:text-indigo-400 transition-colors">
                      {step.level}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{step.range}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Phần thu nhập chịu thuế</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-indigo-400">{step.rate}</span>
                </div>
              ))}
            </div>

            <div className="sticky top-32">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                  <BookOpen className="w-7 h-7" /> Ví dụ thực tế
                </h3>
                <div className="space-y-6 text-indigo-100 font-medium leading-relaxed">
                  <p>Nếu thu nhập tính thuế của bạn là <strong className="text-white">12.000.000 ₫</strong>:</p>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center py-3 border-b border-white/10">
                      <span>• 5 triệu đầu (Bậc 1 - 5%):</span>
                      <span className="font-black text-white">250.000 ₫</span>
                    </li>
                    <li className="flex justify-between items-center py-3 border-b border-white/10">
                      <span>• 5 triệu tiếp theo (Bậc 2 - 10%):</span>
                      <span className="font-black text-white">500.000 ₫</span>
                    </li>
                    <li className="flex justify-between items-center py-3">
                      <span>• 2 triệu còn lại (Bậc 3 - 15%):</span>
                      <span className="font-black text-white">300.000 ₫</span>
                    </li>
                  </ul>
                  <div className="pt-8 flex justify-between items-center">
                    <span className="text-sm font-black uppercase tracking-widest text-indigo-200">Tổng thuế phải nộp:</span>
                    <span className="text-4xl font-black text-white">1.050.000 ₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-white border-t border-slate-200 pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2.5 rounded-2xl text-white">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900">VietTax Pro</span>
              </div>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm">
                Đồng hành cùng người lao động Việt Nam trên hành trình làm chủ tài chính cá nhân. Dữ liệu chuẩn xác, giao diện hiện đại.
              </p>
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Liên kết</h5>
              <ul className="space-y-4 text-sm font-black text-slate-600">
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Trang chủ</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}>Máy tính thuế</li>
                <li className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => document.getElementById('knowledge')?.scrollIntoView({ behavior: 'smooth' })}>Kiến thức</li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Hỗ trợ</h5>
              <ul className="space-y-4 text-sm font-black text-slate-600">
                <li className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer">Văn bản pháp luật <ExternalLink className="w-3 h-3" /></li>
                <li className="hover:text-indigo-600 cursor-pointer">Bảo mật thông tin</li>
                <li className="hover:text-indigo-600 cursor-pointer">Điều khoản sử dụng</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase tracking-widest">© 2024 VIETTAX PRO. TRẢI NGHIỆM TÀI CHÍNH KỸ THUẬT SỐ.</p>
            <div className="flex items-center gap-8">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-xs font-black text-slate-900 uppercase tracking-widest hover:text-indigo-600 transition-all">Lên đầu trang</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
