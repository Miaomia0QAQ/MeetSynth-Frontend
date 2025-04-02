import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForbiddenPage.module.css'; // 导入CSS Modules

const ForbiddenPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>403</div>
        <h1 className={styles.title}>权限不足</h1>
        <p className={styles.description}>
          抱歉，您没有权限访问此页面
        </p>
        <div className={styles.actions}>
          <button 
            className={styles.button}
            onClick={() => navigate('/')}
          >
            返回首页
          </button>
        </div>
        <div className={styles.imageContainer}>
          <img 
            src="https://example.com/403-illustration.svg" 
            alt="权限不足"
            className={styles.image}
          />
        </div>
        <p className={styles.tip}>
          如有疑问，请联系管理员或稍后再试
        </p>
      </div>
    </div>
  );
};

export default ForbiddenPage;