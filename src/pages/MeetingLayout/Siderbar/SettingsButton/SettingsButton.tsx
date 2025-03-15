import { useState } from 'react';
import { Popover, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const SettingsButton = () => {
  const [open, setOpen] = useState(false);
  const [voice, setVoice] = useState('default');
  const [domain, setDomain] = useState('general');

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const content = () => (
    <div className="settings-popover">
      <div className="setting-item">
        <label>录音语音</label>
        <Select
          value={voice}
          style={{ width: '100%' }}
          onChange={(value) => setVoice(value)}
          options={[
            { value: 'default', label: '默认语音' },
            { value: 'mandarin', label: '普通话' },
            { value: 'cantonese', label: '粤语' },
            { value: 'english', label: '英语' },
          ]}
        />
      </div>
      
      <div className="setting-item" style={{ marginTop: 16 }}>
        <label>相关领域</label>
        <Select
          value={domain}
          style={{ width: '100%' }}
          onChange={(value) => setDomain(value)}
          options={[
            { value: 'general', label: '通用' },
            { value: 'medical', label: '医疗' },
            { value: 'financial', label: '金融' },
            { value: 'technology', label: '科技' },
          ]}
        />
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title="设置"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="left"
    >
      <button 
        className="nav-btn"
      >
        <FontAwesomeIcon icon={faCog} className="icon" />
      </button>
    </Popover>
  );
};

export default SettingsButton;